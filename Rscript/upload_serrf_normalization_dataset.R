upload_serrf_normalization_dataset <- function(path="upload_loess_normalization_dataset_example.xlsx") {
  pacman::p_load(data.table, stringr)

  # read data and split data into sample_info, compound_info, and expression_data
  if(str_sub(path,-5,-1)=='.xlsx'){
    data = readxl::read_excel(path, col_names = FALSE)
    data = data.table(data)
  }else{
    data = fread(path, header  = FALSE)
  }

  if(!(is.na(data[[1]][1]) | data[[1]][1]=="")){
    label_index = which(data[[1]] == 'label')
    p = data.table(t(data[1:label_index,]))
    colnames(p) = as.character(p[1,])
    p = p[-1,]
    p$label = make.unique(p$label)

    f = data.table(data[(label_index+1):nrow(data),1])
    colnames(f) = "label"
    f$label = make.unique(f$label)

    e = data.matrix(data[(label_index+1):nrow(data),-1])
    rownames(e) = f$label
    colnames(e) = p$label


  }else{

    start_col_index = max(which(is.na(data[1,])))+1
    start_row_index = max(which(is.na(data[,1])))+1

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

  data_matrix = as.matrix(data)



  pca = prcomp(t(e), scale. = TRUE)
  plot(pca$x[,1],pca$x[,2])
  plot(pca$rotation[,1],pca$rotation[,2])

  RSDs = c()
  for(i in 1:nrow(e)){
    e_qc = e[,p$sampleType=='qc']
    dta = data.table(y = e_qc[i,], t(e_qc[-i,]))
    colnames(dta) = c("y", paste0("x",1:(ncol(dta)-1)))

    error_cv = c()
    for(k in 1:5){
      train_index = sample(1:nrow(dta), nrow(dta)*0.8)
      test_index = c(1:nrow(dta))[!c(1:nrow(dta)) %in% train_index]
      predicted = predict(randomForest::randomForest(y~., data = dta[train_index,]),newdata = dta[test_index,])
      corrected = dta[test_index,]$y/predicted
      error_cv[k] = sd(corrected)/mean(corrected)
    }
    RSDs[i] = mean(error_cv)
  }
  mean(RSDs)







  return(list(
    p = p,
    f = f,
    e = e,
    data_matrix = data_matrix
  ))
}
