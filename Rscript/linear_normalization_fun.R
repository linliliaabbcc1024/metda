
  pacman::p_load(data.table, affy)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  linear.baseline <- apply(e, 1, median, na.rm=TRUE)
  baseline.mean <- mean(linear.baseline, na.rm=TRUE)
  sample.means <- apply(e, 2, mean, na.rm=TRUE)
  linear.scaling <- baseline.mean/sample.means
  e_linear_normalization_norm <- t(t(e) * linear.scaling)

  data = aggregate_p_f_e(p, f, e_linear_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>Linear normalization is performed.</b>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )

















