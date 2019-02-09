upload_log_transformation_dataset<- function(path="upload_log_transformation_dataset_example.csv") {
  pacman::p_load(data.table, stringr)

  # read data and split data into sample_info, compound_info, and expression_data
  if(str_sub(path,-5,-1)=='.xlsx'){
    data = readxl::read_excel(path, col_names = FALSE)
    data = data.table(data)
  }else{
    data = fread(path, header  = FALSE)
  }

  colnames(data) = as.character(data[1,])
  data = data[-1,]

  f = data.table(label = data$label)

  p = data.table(label = colnames(data)[-c(1)])

  e = data.matrix(data[,-c(1)])
  rownames(e) = f$label
  colnames(e) = colnames(data)[-c(1)]


  data_matrix = as.matrix(data)

  return(list(
    f = f,
    e = e,
    p = p,
    data_matrix = data_matrix
  ))
}
