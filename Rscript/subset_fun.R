

  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  if(length(sample_criterions) > 0){
    sample_subsets = list()
    for(i in 1:nrow(sample_criterions)){
      if(sample_criterions[i,'type'] == 'character') sample_subsets[[sample_criterions[i,'column']]] = p[[sample_criterions[i,'column']]] %in% sample_criterions[i,'criterion'][[1]] else sample_subsets[[sample_criterions[i,'column']]] = as.numeric(p[[sample_criterions[i,'column']]]) >= min(sample_criterions[i,'criterion'][[1]]) & as.numeric(p[[sample_criterions[i,'column']]]) <= max(sample_criterions[i,'criterion'][[1]])
    }
    sample_subsets_criterion = apply(do.call("cbind",sample_subsets),1,all)
  }else{
    sample_subsets_criterion = rep(T, nrow(p))
  }


  if(length(compound_criterions) > 0){
    compound_subsets = list()
    for(i in 1:nrow(compound_criterions)){
      if(compound_criterions[i,'type'] == 'character') compound_subsets[[compound_criterions[i,'column']]] = f[[compound_criterions[i,'column']]] %in% compound_criterions[i,'criterion'][[1]] else compound_subsets[[compound_criterions[i,'column']]] = as.numeric(f[[compound_criterions[i,'column']]]) >= min(compound_criterions[i,'criterion'][[1]]) & as.numeric(f[[compound_criterions[i,'column']]]) <= max(compound_criterions[i,'criterion'][[1]])
    }

    compound_subsets_criterion = apply(do.call("cbind",compound_subsets),1,all)
  }else{
    compound_subsets_criterion = rep(T, nrow(f))
  }

  new_p = p[which(sample_subsets_criterion),]
  new_f = f[which(compound_subsets_criterion),]
  new_e = e[which(compound_subsets_criterion),which(sample_subsets_criterion)]



  if(is.null(dim(new_e))){# this means there is only one compound left meets this criterion. Make new_e a matrix with nrow 1.
    new_e = matrix(new_e, nrow = 1)
  }else if(nrow(new_e)==0){
    stop("There is no row meeting you criterion.")
  }




  new_p[[length(new_p)+1]] = new_p$label
  new_p$label = NULL
  colnames(new_p)[length(new_p)] = "label"
  # return(list(colnames(new_p), t(new_p), new_f$label, class(new_e)))

  p_plus_e = rbind(cbind(colnames(new_p),t(new_p)), cbind(new_f$label,new_e))

  # add some NA to the top of the f.
  f_label_index = which(p_plus_e[,1]=='label')
  NA_plus_f = rbind(matrix(NA, nrow = f_label_index-1, ncol = ncol(new_f)),rbind(matrix(colnames(new_f), nrow = 1),sapply(new_f, as.character)))
  NA_plus_f = NA_plus_f[,-which(colnames(NA_plus_f) %in% 'label')]



  data = cbind(NA_plus_f, p_plus_e)

  data_matrix = as.matrix(data)

  report_html = "Dataset is subsetted."


 result = 
    list(e = new_e,
         f = new_f,
         p = new_p,
         data_matrix = data_matrix,
         report_html = report_html)
 

















