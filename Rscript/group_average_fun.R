

  pacman::p_load(data.table)

  # fwrite(data.table(p), "p.csv")
  # fwrite(data.table(f), "f.csv")
  # fwrite(data.table(e), "e.csv")
  # return(T)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }


  if(method == 'median'){
    averages = sapply(levels(group), function(g){
      sub_e = e[,group %in% g]
      result = apply(sub_e,1,median,na.rm=TRUE)
      result[is.na(result)] = 0
      return(result)
    }, simplify = FALSE)
  }else{
    averages = sapply(levels(group), function(g){
      sub_e = e[,group %in% g]
      result = apply(sub_e,1,mean,na.rm=TRUE)
      result[is.na(result)] = 0
      return(result)
    }, simplify = FALSE)
  }

  averages = do.call("cbind",averages)

  colnames(averages) = paste0(gsub("\\.","_",levels(group)), " ", method, " average")

  averages = data.table(index = 1:nrow(f), label = f$label, averages)



  #data_matrix = as.matrix(averages)
  report_html = paste0("<b><code>",column,"</code> group <code>",method,"</code> average is calculated for each compound.</b>")

 result = list(
    data_matrix = averages,
    report_html =report_html
  )




















