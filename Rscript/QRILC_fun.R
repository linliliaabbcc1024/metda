impute.QRILC.moderate = function(dataSet.mvs, tune.sigma = 1){
  nFeatures = dim(dataSet.mvs)[1]
  nSamples = dim(dataSet.mvs)[2]
  dataSet.imputed = dataSet.mvs
  QR.obj = list()
  for (i in 1:nSamples) {
    curr.sample = dataSet.mvs[, i]
    pNAs = length(which(is.na(curr.sample)))/length(curr.sample)
    upper.q = 0.99
    q.normal = qnorm(seq((pNAs + 0.001), (upper.q + 0.001),
                         (upper.q - pNAs)/(upper.q * 100)), mean = 0, sd = 1)
    q.curr.sample = quantile(curr.sample, probs = seq(0.001,
                                                      (upper.q + 0.001), 0.01), na.rm = T)
    temp.QR = lm(q.curr.sample ~ q.normal)
    QR.obj[[i]] = temp.QR
    mean.CDD = temp.QR$coefficients[1]
    sd.CDD = as.numeric(temp.QR$coefficients[2])
    data.to.imp = tryCatch(tmvtnorm::rtmvnorm(n = nFeatures, mean = mean.CDD,
                                              sigma = sd.CDD * tune.sigma, upper = qnorm((pNAs +
                                                                                            0.001), mean = mean.CDD, sd = sd.CDD), algorithm = c("gibbs")),error = function(e){
                                                                                              if(sum(!is.na(dataSet.mvs[, i]))==1){
                                                                                                return(rep(curr.sample[!is.na(dataSet.mvs[, i])],nrow(dataSet.mvs)))
                                                                                              }else if(sum(!is.na(dataSet.mvs[, i]))==0){
                                                                                                return(rep(0, nrow(dataSet.mvs)))
                                                                                              }
                                                                                            })
    curr.sample.imputed = curr.sample
    curr.sample.imputed[which(is.na(curr.sample))] = data.to.imp[which(is.na(curr.sample))]
    dataSet.imputed[, i] = curr.sample.imputed
  }
  results = list(dataSet.imputed, QR.obj)
  
  return(results)
}


  pacman::p_load(data.table, imputeLCMD,  magrittr)

  # fwrite(data.table(p), "p.csv")
  # fwrite(data.table(f), "f.csv")
  # fwrite(data.table(e), "e.csv")
  # return(T)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }


  # write.csv(e,'e.csv')


  imputeds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    sub_e[sub_e==0] = 1
    sub_e <- t(data.frame(t(sub_e)) %>% log %>% impute.QRILC.moderate %>% extract2(1) %>% exp)
    return(sub_e)
  }, simplify = FALSE)

  imputed = e
  names(imputeds) = levels(group)
  for(g in levels(group)){
    imputed[,group %in% g] = imputeds[[which(levels(group)%in%g)]]
  }

  data = aggregate_p_f_e(p, f, imputed)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>QRILC was performed. In total, there were ",sum(is.na(e))," missing values imputed.</b>")

  # fwrite(data.table(imputed),"test.csv")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html,
    group = imputeds
  )


























