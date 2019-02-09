
  pacman::p_load(data.table)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))


  medians = apply(e, 2, median, na.rm=T)
  mean_medians = mean(medians)
  e_median_normalization_norm = t(t(e)/(medians/mean_medians))


  data = aggregate_p_f_e(p, f, e_median_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>median normalization is performed. The compounds were normalized to the median average of the compounds value.</b>")

result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )





















