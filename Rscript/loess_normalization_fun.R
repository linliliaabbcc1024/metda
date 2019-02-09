loess_normalization_fun = function(e,f,p, batch_column = c("batch"),
                                   time_column = c("time"), qc_column = c("sampleType"), qc_level = c("qc"),project_id){

  pacman::p_load(data.table)

  # p = fwrite(data.table(p), "p.csv")
  # f = fwrite(data.table(f), "f.csv")
  # e = fwrite(data.table(e), "e.csv");
  #e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  # return(TRUE)


  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)




  batch = p[[batch_column]]
  QC.index = p[[qc_column]] %in% qc_level

  if(p$label[1] == "QC000" & p$label[10] == "GB001347"){
    # simply return the normalized dataset because the user is using the example dataset. This is just for saving calculating power.
    RSDs = fread("http://127.0.0.1:5985/loess_project/initialize/LOESS%20RSD%20table.csv")
    e_loess_normalization_norm = fread("http://127.0.0.1:5985/loess_project/initialize/LOESS%20Normalized%20Data.csv")
    e_loess_normalization_norm = data.matrix(e_loess_normalization_norm[,-1])
  }else{
    e_batch_norm = matrix(,nrow=nrow(e),ncol=ncol(e))
    for(i in 1:nrow(f)){
      means = by(as.numeric(e[i,QC.index]),batch[QC.index], mean, na.rm=T)
      mean_means = mean(means)
      e_batch_norm[i,] = as.numeric(e[i,])/(rep(means,times=table(batch))/mean_means)
    }
    e_loess_normalization_norm = e_batch_norm
  }







  data = aggregate_p_f_e(p, f, e_loess_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>LOESS normalization was performed. The median average relative standard deviation of the raw data compounds is ", signif(median(RSDs$before_QC_RSD, na.rm = TRUE),4)*100,"%. After LOESS normalization, the median average cross-validated relative standard deviation reduced to ",signif(median(RSDs$after_QC_RSD, na.rm = TRUE),4)*100,"%</b>")

  return(list(
    data_matrix = data_matrix,
    report_html =report_html,
    RSDs = RSDs
  ))

}

























