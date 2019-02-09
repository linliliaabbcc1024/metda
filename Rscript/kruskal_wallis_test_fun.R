


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
    tryCatch(kruskal.test(x~groups)$p.value,error = function(e){return(1)})
  })


  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  report_html = paste0("<b>One-way Kruskal-Wallis test was performed on each compound to test if at least one level of <code>",column,"</code> has a mean average significantly different form the rest As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values, method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")




 result = list(
    result = result,
    report_html =report_html
  )



















