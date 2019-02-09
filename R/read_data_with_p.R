read_data_with_p = function(data){
  label_index = which(data[[1]] == 'label')
  p = data.table(t(data[1:label_index,]))
  colnames(p) = as.character(p[1,])
  p = p[-1,]
  if(is.null(dim(p))){
    p = data.table(label = p)
  }
  p$label = make.unique(p$label)

  f = data.table(data[(label_index+1):nrow(data),1])
  if(is.null(dim(f))){
    f= data.table(label = f)
  }
  colnames(f) = "label"
  f$label = make.unique(f$label)

  e = data.matrix(data[(label_index+1):nrow(data),-1])
  rownames(e) = f$label
  colnames(e) = p$label

  return(list(p = p, f = f, e = e))
}
