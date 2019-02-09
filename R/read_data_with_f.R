read_data_with_f = function(data){
  label_index = which(data[1,] == 'label')

  p = data.table(label = as.character(data[1,(label_index+1):ncol(data)]))
  if(is.null(dim(p))){
    p = data.table(label = p)
  }
  p$label = make.unique(p$label)

  f = data.table(data[,1:label_index])
  colnames(f) = as.character(f[1,])
  f = f[-1,]
  if(is.null(dim(f))){
    f = data.table(label = f)
  }
  f$label = make.unique(f$label)

  e = data.matrix(data[-1,(label_index+1):ncol(data)])
  rownames(e) = f$label
  colnames(e) = p$label

  return(list(p = p, f = f, e = e))
}
