
  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  new_p = p
  new_f = f
  new_e = e

  if(length(sample_infos$dataSet)>0){

    sample_infos$column_names = sample_infos$column # give user to renew the the column names of new samples/compounds column names.

    for(i in 1:length(sample_infos$dataSet)){
      add_p = data.table(sample_infos$dataSet[[i]][-1,])
      colnames(add_p) = sample_infos$dataSet[[i]][1,]
      add_p = add_p[,c('label',sample_infos$column[[i]])]
      new_p_temp = merge(new_p, add_p, by = 'label', all.x = TRUE, all.y = FALSE, sort = FALSE)
      sample_infos$column_names[[i]] = colnames(new_p_temp)[!colnames(new_p_temp)%in%colnames(new_p)]
      new_p = new_p_temp
    }


  }

  if(length(compound_infos$dataSet)>0){

    compound_infos$column_names = compound_infos$column # give user to renew the the column names of new compounds/compounds column names.

    for(i in 1:length(compound_infos$dataSet)){
      add_f = data.table(compound_infos$dataSet[[i]][-1,])
      colnames(add_f) = compound_infos$dataSet[[i]][1,]
      add_f = add_f[,c('label',compound_infos$column[[i]])]
      new_f_temp = merge(new_f, add_f, by = 'label', all.x = TRUE, all.y = FALSE, sort = FALSE)
      compound_infos$column_names[[i]] = colnames(new_f_temp)[!colnames(new_f_temp)%in%colnames(new_f)]
      new_f = new_f_temp
    }


  }



  new_p[[length(new_p)+1]] = new_p$label
  new_p$label = NULL
  colnames(new_p)[length(new_p)] = "label"
  p_plus_e = rbind(cbind(colnames(new_p),t(new_p)), cbind(new_f$label,new_e))

  # add some NA to the top of the f.
  f_label_index = which(p_plus_e[,1]=='label')
  NA_plus_f = rbind(matrix(NA, nrow = f_label_index-1, ncol = ncol(new_f)),rbind(matrix(colnames(new_f), nrow = 1),sapply(new_f, as.character)))
  NA_plus_f = NA_plus_f[,-which(colnames(NA_plus_f) %in% 'label')]



  data = cbind(NA_plus_f, p_plus_e)

  data_matrix = as.matrix(data)

  report_html = "Dataset is attached."


  result = 
    list(e = new_e,
         f = new_f,
         p = new_p,
         data_matrix = data_matrix,
         report_html = report_html,
         sample_infos = sample_infos,
         compound_infos = compound_infos)
  

  # return(list(sample_infos = sample_infos,
  #             compound_infos = compound_infos,
  #             column = sample_infos$column[[1]],
  #             column_class = class(sample_infos$column),
  #             dataSet = sample_infos$dataSet[[1]],
  #             dataSet_class = class(sample_infos$dataSet[[1]]),
  #             dataSet_dim = dim(sample_infos$dataSet[[1]])))



























