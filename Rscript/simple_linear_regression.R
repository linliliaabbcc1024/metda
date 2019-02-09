
  pacman::p_load(data.table, ropls)
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

  if(scale=='none'){
    sds = rep(1,nrow(f))
  }else if(scale=="standard"){
    sds = apply(e,1,sd,na.rm = TRUE)
  }else if(scale=='pareto'){
    sds = sqrt(apply(e,1,sd,na.rm = TRUE))
  }else if(scale == "center"){
    sds = rep(1,nrow(f))
  }

  e_t = t(e)
  e_scale = scale(e_t, center = !scale=='none', scale = sds)

  y = as.numeric(p[[column]])


  result_matrix = t(apply(e_scale,2,function(x){
    lm = lm(y~x)
    smr = summary(lm)
    beta = smr$coefficients[2,1]
    pval = smr$coefficients[2,4]
    r2 = smr$r.squared
    r2_adj = smr$adj.r.squared
    return(c(r2,r2_adj,beta,pval))
  }))

  p_values_adjusted = p.adjust(result_matrix[,4], method = FDR)

  result = data.table(index=1:nrow(f), label = f$label, result_matrix,p_values_adjusted)
  colnames(result) = c("index",'label',"R_square",'adjusted_R_square', "regression_coefficient", "p_value", "p_values_adjusted")






  report_html = paste0("<h4>Simple linear regressions between <code>",column,"</code> and each compound were applied. There are ",sum(result_matrix[,4]<0.05, na.rm = TRUE)," compounds significantly associated with the <code>",column,"</code> with p value < 0.05. To control the False Discovery Rate (FDR), <code>",FDR,"</code> was applied on the p_values. There are <code>",sum(p_values_adjusted<0.05, na.rm = TRUE),"</code> still significant after correct for the FDR. Regression coefficients were provided to indicate possitive/negative association. The R-square and adjusted R-square, which measures how close the data are to the fitted regression line, are also calculated.</h4>")



result = list(
    result = result,
    report_html =report_html
  )
















