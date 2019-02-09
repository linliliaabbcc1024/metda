upload_shapiro_test_dataset <- function(path="upload_shapiro_test_dataset_example.xlsx") {
  pacman::p_load(data.table, stringr)

  # read data and split data into sample_info, compound_info, and expression_data
  if(str_sub(path,-5,-1)=='.xlsx'){
    data = readxl::read_excel(path, col_names = FALSE)
    data = data.table(data)
  }else{
    data = fread(path, header  = FALSE)
  }

  label_index = which(data[[1]] == 'label')
  p = data.table(t(data[1:label_index,]))
  colnames(p) = as.character(p[1,])
  p = p[-1,]
  if(!length(unique(p[[ncol(p)-1]]))==2){
    stop("Must have only two groups!")
  }
  p$label = make.unique(p$label)

  f = data.table(data[(label_index+1):nrow(data),1])
  colnames(f) = "label"
  f$label = make.unique(f$label)

  e = data.matrix(data[(label_index+1):nrow(data),-1])
  rownames(e) = f$label
  colnames(e) = p$label


  data_matrix = as.matrix(data)

  return(list(
    p = p,
    f = f,
    e = e,
    data_matrix = data_matrix
  ))
}
