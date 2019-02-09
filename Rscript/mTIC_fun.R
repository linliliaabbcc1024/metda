
  pacman::p_load(data.table, imputeLCMD,  magrittr)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  # e = t(apply(e,1,as.numeric))

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  index = f[[known_column]] %in% known_level

  sums = apply(e[index,], 2, sum, na.rm=T)
  mean_sums = mean(sums)
  e_mTIC_norm = t(t(e)/(sums/mean_sums))


  data = aggregate_p_f_e(p, f, e_mTIC_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>mTIC normalization is performed. The compounds were normalized to the sum of the compounds <code>",known_column," (",paste0(known_level,", "),")</code></b>")

 result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )





















