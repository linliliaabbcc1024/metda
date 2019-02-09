
  pacman::p_load(data.table)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  groups1 = factor(p[[groups_ind]])
  groups2 = factor(p[[groups_dep]])
  id = factor(p[[id]])


  p_values = apply(e,1,function(x){
    return(summary(aov(x ~ groups1 * groups2 + Error(id/groups2)))[[2]][[1]][2,5])
  })

  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))

  report_html = paste0("<b>Two-way Mixed ANOVA was performed on each compound to test if the interaction between <code>",groups_ind,"</code> (independent group) and <code>",groups_dep,"</code> (dependent group) is significant. As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values, method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")

  result = list(
    result = result,
    report_html =report_html
  )




















