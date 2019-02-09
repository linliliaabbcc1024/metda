upload_mtic_normalization <- function(path="upload_mtic normalization_dataset_example.csv") {
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

  f = data.table(data[[2]], v1 = data[[1]])
  colnames(f) = c("label", colnames(data)[1])

  p = data.table(label = colnames(data)[-c(1,2)])

  e = data.matrix(data[,-c(1,2)])
  rownames(e) = f$label
  colnames(e) = colnames(data)[-c(1,2)]


  data_matrix = as.matrix(data)

  return(list(
    f = f,
    e = e,
    p = p,
    data_matrix = data_matrix
  ))
}
