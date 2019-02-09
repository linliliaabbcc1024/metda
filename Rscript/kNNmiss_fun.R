

  pacman::p_load(data.table, imputeLCMD,  magrittr, impute)
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


  # write.csv(e,'e.csv')



  imputeds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    bad_data_index = which(apply(sub_e,1,function(x){sum(is.na(x))})/ncol(sub_e)>0.8)
    for(i in bad_data_index){
      sub_e[i,is.na(sub_e[i,])] = 0.5 * min(sub_e[i,!is.na(sub_e[i,])])
    }
    sub_e <- t(data.frame(t(sub_e)) %>% data.matrix %>% impute.knn %>% extract2(1))
    return(sub_e)
  }, simplify = FALSE)

  imputed = e
  names(imputeds) = levels(group)
  for(g in levels(group)){
    imputed[,group %in% g] = imputeds[[which(levels(group)%in%g)]]
  }

  data = aggregate_p_f_e(p, f, imputed)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>kNN-miss was performed. In total, there were ",sum(is.na(e))," missing values imputed.</b>")


result = list(
    data_matrix = data_matrix,
    report_html =report_html,
    group = imputeds
  )
























