

  pacman::p_load(data.table, imputeLCMD,  magrittr)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }


  imputeds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    row_indexes = which(is.na(sub_e), arr.ind = TRUE)[,1]
    if(method=="HM"){
      for(i in row_indexes){
        sub_e[i,is.na(sub_e[i,])] = 1/2 * min(sub_e[i,!is.na(sub_e[i,])])
      }
    }else if(method=="minimum"){
      for(i in row_indexes){
        sub_e[i,is.na(sub_e[i,])] = min(sub_e[i,!is.na(sub_e[i,])])
      }
    }else if(method=="median"){
      for(i in row_indexes){
        sub_e[i,is.na(sub_e[i,])] = median(sub_e[i,!is.na(sub_e[i,])])
      }
    }else if(method=="mean"){
      for(i in row_indexes){
        sub_e[i,is.na(sub_e[i,])] = mean(sub_e[i,!is.na(sub_e[i,])])
      }
    }else if(method=='zero'){
      for(i in row_indexes){
        sub_e[i,is.na(sub_e[i,])] = 0
      }
    }
    return(sub_e)
  }, simplify = FALSE)



  if(method=="HM"){
    method_desc = "half-minimum"
  }else if(method=="minimum"){
    method_desc = "minimum"
  }else if(method=="median"){
    method_desc = "median average"
  }else if(method=="mean"){
    method_desc = "mean average"
  }else if(method=='zero'){
    method_desc = "zero"
  }

  imputed = e
  names(imputeds) = levels(group)
  for(g in levels(group)){
    imputed[,group %in% g] = imputeds[[which(levels(group)%in%g)]]
  }

  data = aggregate_p_f_e(p, f, imputed)

  data_matrix = as.matrix(data)

  report_html = paste0("<b>In total, there were ",sum(is.na(e))," missing values imputed. The missing values were imputed by <code>",method_desc,"</code> for each compound.</b>")


result = list(
    data_matrix = data_matrix,
    report_html =report_html,
    group = imputeds
  )

























