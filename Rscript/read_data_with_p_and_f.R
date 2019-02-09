
  start_col_index = min(which(diff(which(is.na(data[1,])))>1)+1)
  if(start_col_index==Inf){
    start_col_index = max(which(is.na(data[1,])))+1
  }

  start_row_index = min(which(diff(which(is.na(data[,1])))>1)+1)
  if(start_row_index==Inf){
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
  if(is.null(dim(p))){
    p = data.table(label = p)
  }
  p$label = make.unique(p$label)

  f = data.table(data[start_row_index:nrow(data),1:start_col_index])
  colnames(f) = as.character(f[1,])
  f = f[-1,]
  if(is.null(dim(f))){
    f= data.table(label = f)
  }
  f$label = make.unique(f$label)

  e = data.matrix(data[(start_row_index+1):nrow(data),(start_col_index+1):ncol(data)])
  rownames(e) = f$label
  colnames(e) = p$label

 result =list(p = p, f = f, e = e)
