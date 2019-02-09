upload_data_from_input = function(txt = "",module_text=""){

  # return(txt)

  pacman::p_load(data.table)

  txt_n = strsplit(txt, split = "\n")[[1]]
  txt_t = sapply(txt_n,function(x){ strsplit(x, split = "\t", fixed = FALSE, perl = FALSE, useBytes = FALSE)})
  names(txt_t) = NULL

  # save(txt, txt_t, file = "test.RData")
  # return(TRUE)

  data_frame = do.call('rbind',txt_t)
  data_frame[data_frame==""] = NA
  data = data.table(data_frame)

  if(!(is.na(data[[1]][1]) | data[[1]][1]=="")){
    if("label" %in% data[1,]){
      dta = read_data_with_f(data)
    }else{
      dta = read_data_with_p(data)
    }
  }else{
    dta = read_data_with_p_and_f(data)
  }

  f = dta$f
  f$label[!is.na(as.numeric(f$label))] = make.names(f$label[!is.na(as.numeric(f$label))])
  p = dta$p
  e = dta$e

  f[is.na(f)] = ""
  p[is.na(p)] = ""

  data_matrix = as.matrix(data)
  e = apply(e,2,as.numeric)

  if(module_text==""){
    e=1
  }
  fwrite(data.table(e),"e.csv")

  # return(data)





  return(list(f = f, p = p, e = e, data_matrix = data_matrix))
}
