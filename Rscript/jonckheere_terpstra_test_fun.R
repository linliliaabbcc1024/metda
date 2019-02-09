
  pacman::p_load(data.table, clinfun)

  levels = strsplit(levels,"\\|\\|")[[1]]

  if(any(!levels%in%p[[column]])){
    stop("Please check the format of 'levels'. Must split by '||'.")
  }

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

  groups = factor(p[[column]], levels = levels)
  #levels = levels(groups)
  groups = as.numeric(groups)


  p_values = apply(e,1,function(x){
    tryCatch(jonckheere.test(x, groups, alternative = alternative)$p.value,error = function(e){return(1)})
  })

  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  if(alternative == 'two.sided'){
    report_html = paste0("<b>Jonckheere-Terpstra was performed on each compound to test if compound significantly monotonically changed with <code>",column,"</code>. As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values, method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")
  }else{
    report_html = paste0("<b>Jonckheere-Terpstra was performed on each compound to test if compound significantly monotonically <code>",alternative,"</code>d with <code>",column,"</code>. As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values, method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")
  }

 result = list(
    result = result,
    report_html =report_html
  )
















