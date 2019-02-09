
  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

  columns_name = columns
  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))


  #columns = factor(p[[columns]])


  e_adjusted = t(apply(e,1,function(x){
    dta = data.table(value = x, p[,columns])
    lm(x~.,data = dta)$res
  }))

  p_values = apply(e_adjusted,1,function(x){
    shapiro.test(x)$p.value
  })


  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))

  if(QQ){
    f_label_name = make.names(f$label)
    filenames = sapply(1:nrow(e_adjusted), function(i){
      paste0(i,"th - ", f_label_name[i],".png")
    })

    for(i in 1:nrow(e_adjusted)){
      png(filename = filenames[i])
      qqnorm(e_adjusted[i,], pch = 1, frame = FALSE)
      qqline(e_adjusted[i,], col = "steelblue", lwd = 2)
      dev.off()
    }
    zip(zipfile = "Q-Q plots.zip", files = filenames)
  }


  report_html = paste0("<h4>Shapiro-Wilk Normality test was used on each compound to test if the residual of <code>",paste0(columns_name, collapse = ", "),"</code> is normally distributed. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05, indicating a violation of normality. To control the false disvoery rate (FDR), <code>",FDR,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction, indicating a strong evidence of violation of normality.</h4>")

  result = list(
    result=result,
    report_html=report_html
  )















