
  pacman::p_load(data.table)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  # e = t(apply(e,1,as.numeric))


e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  sums = apply(e, 2, sum, na.rm=T)
  mean_sums = mean(sums)
  e_sum_normalization_norm = t(t(e)/(sums/mean_sums))


  data = aggregate_p_f_e(p, f, e_sum_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>sum normalization is performed. The compounds were normalized to the total sum of the compounds value.</b>")

result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )





















