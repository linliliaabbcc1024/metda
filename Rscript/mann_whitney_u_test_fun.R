
  pacman::p_load(data.table)

  # fwrite(data.table(p),"p.csv")
  # fwrite(data.table(f),"f.csv")
  # fwrite(data.table(e),"e.csv")
  # return(p)

  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  groups = factor(p[[column]])
  levels = levels(groups)


  p_values = apply(e,1,function(x){
    tryCatch(wilcox.test(x~groups, alternative = alternative)$p.value,error = function(e){return(1)})
  })


  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  report_html = paste0("<h4>Mann-Whitney U test was performed on each compound to test if the median average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), the <code>",FDR,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")




result = list(
    result = result,
    report_html =report_html
  )


















