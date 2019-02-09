
  pacman::p_load(data.table, stringr)
  # read data and split data into sample_info, compound_info, and expression_data
  if(str_sub(path,-5,-1)=='.xlsx'){
    data = readxl::read_excel(path, col_names = FALSE)
    data = data.table(data)
  }else{
    data = fread(path, header  = FALSE)
  }
  data[data==""] = NA


# e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  if(!(is.na(data[[1]][1]) | data[[1]][1]=="")){
    label_index = which(data[[1]] == 'label')
    if(length(label_index)==0){
      colnames(data) = as.character(data[1,])
      data = data[-1,]
      p = 'NA'
      f = data
      e = "NA"
    }else{
      p = data.table(t(data[1:label_index,]))
      colnames(p) = as.character(p[1,])
      p = p[-1,]
      if(is.null(dim(p))){
        p = data.table(label = p)
      }


      p$label = make.unique(p$label)
      f = data.table(data[(label_index+1):nrow(data),1])
      colnames(f) = "label"
      f$label = make.unique(f$label)
      e = data.matrix(data[(label_index+1):nrow(data),-1])
      rownames(e) = f$label
      colnames(e) = p$label
    }
  }else{
    start_col_index = min(which(diff(which(is.na(data[1,])))>1)+1)
    if(!is.finite(start_col_index)){
      start_col_index = max(which(is.na(data[1,])))+1
    }

    start_row_index = min(which(diff(which(is.na(data[,1])))>1)+1)
    if(!is.finite(start_row_index)){
      start_row_index = max(which(is.na(data[,1])))+1
    }

    if(start_col_index == -Inf){
      start_col_index = max(which(data[1,]==""))+1
    }
    if(start_row_index == -Inf){
      start_row_index = max(which(data[,1]==""))+1
    }


    p = data.table(t(data[1:start_row_index,start_col_index:ncol(data)]))
    colnames(p) = as.character(p[1,])
    p = p[-1,]
    p$label = make.unique(p$label)

    f = data.table(data[start_row_index:nrow(data),1:start_col_index])
    colnames(f) = as.character(f[1,])
    f = f[-1,]
    f$label = make.unique(f$label)

    e = data.matrix(data[(start_row_index+1):nrow(data),(start_col_index+1):ncol(data)])
    rownames(e) = f$label
    colnames(e) = p$label

  }

  # filter out too many missing values.
  if(ncol(e)>2){
    bad_compounds_with_too_many_missing_values = apply(e,1,function(x){
      sum(is.na(x))
    }) > ncol(e)-2
    f = f[!bad_compounds_with_too_many_missing_values,]
    e = e[!bad_compounds_with_too_many_missing_values,]
  }

  # filter out zero standard deviation compounds.
  if(ncol(e)>2){
    bad_compounds_with_zero_sd = apply(e,1,sd,na.rm=TRUE) == 0
    f = f[!bad_compounds_with_zero_sd,]
    e = e[!bad_compounds_with_zero_sd,]
  }


  if(is.null(dim(f))){
    f[!is.na(as.numeric(f))] = make.names(f[!is.na(as.numeric(f))])
    f = data.table(label = f)
  }else{
    f$label[!is.na(as.numeric(f$label))] = make.names(f$label[!is.na(as.numeric(f$label))])
  }



  data = aggregate_p_f_e(p, f, e)


  data_matrix = as.matrix(data)
  e = apply(e,2,as.numeric)
  f[is.na(f)] = ""
  p[is.na(p)] = ""

  result = list(e = e, p = p, f = f, data_matrix = data_matrix)

