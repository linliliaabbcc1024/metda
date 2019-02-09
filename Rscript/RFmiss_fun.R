
  pacman::p_load(data.table, imputeLCMD,  magrittr, missForest)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv");e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }


  # write.csv(e,'e.csv')


  imputeds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    sub_e[sub_e==0] = 1
    sub_e <- t(missForest(data.table(t(sub_e)))[[1]])
    return(sub_e)
  }, simplify = FALSE)

  imputed = e
  names(imputeds) = levels(group)
  for(g in levels(group)){
    imputed[,group %in% g] = imputeds[[which(levels(group)%in%g)]]
  }

  data = aggregate_p_f_e(p, f, imputed)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>RFmiss was performed. In total, there were ",sum(is.na(e))," missing values imputed.</b>")

  result=list(
    data_matrix = data_matrix,
    report_html =report_html,
    group = imputeds
  )

























