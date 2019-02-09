
  pacman::p_load(data.table)

  # p = fwrite(data.table(p), "p.csv")
  # f = fwrite(data.table(f), "f.csv")
  # e = fwrite(data.table(e), "e.csv");
  #
  # return(TRUE)


  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  batch = p[[batch_column]]
  QC.index = p[[qc_column]] %in% qc_level


  e_batch_norm = matrix(,nrow=nrow(e),ncol=ncol(e))
  for(i in 1:nrow(f)){
    means = by(as.numeric(e[i,QC.index]),batch[QC.index], mean, na.rm=T)
    mean_means = mean(means)
    e_batch_norm[i,] = as.numeric(e[i,])/(rep(means,times=table(batch))/mean_means)
  }
  e_batchratio_normalization_norm = e_batch_norm




  data = aggregate_p_f_e(p, f, e_batchratio_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<h4>Batch Ratio normalization was performed.</h4>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )






















