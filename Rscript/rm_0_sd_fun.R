

  pacman::p_load(data.table, imputeLCMD,  magrittr)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }
  # write.csv(e,'e.csv')
  sds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    return(apply(e,1,sd,na.rm=TRUE))
  }, simplify = FALSE)


  sds = do.call("cbind",sds)

  filter_indicator = apply(sds, 1, function(x){
    any(x==0) | any(is.na(x))
  })

  total_removed = sum(filter_indicator)

  colnames(sds) = gsub("\\.","_",levels(group))

  sds = data.table(index = 1:nrow(f), label = f$label, sds)

  sds[is.na(sds)] = 0

  f_label_filter_indicator = f$label[filter_indicator]

  e = e[!filter_indicator,]
  f = f[!filter_indicator,]



  data = aggregate_p_f_e(p, f, e)
  # data = e





  # if(method == "log10"){
  #   result = log((e + sqrt(e^2 + 1)) * 0.5, base  = 10)
  # }else if(method == "log2"){
  #   result = log((e + sqrt(e^2 + 1)) * 0.5, base  = 2)
  # }
  #
  #
  # p_plus_e = rbind(cbind(colnames(p),t(p)), cbind(f$label,result))
  #
  # # add some NA to the top of the f.
  # f_label_index = which(p_plus_e[,1]=='label')
  # NA_plus_f = rbind(matrix(NA, nrow = f_label_index-1, ncol = ncol(f)),rbind(matrix(colnames(f), nrow = 1),sapply(f, as.character)))
  # NA_plus_f = NA_plus_f[,-which(colnames(NA_plus_f) %in% 'label')]
  #
  # data = cbind(NA_plus_f, p_plus_e)


  #   pacman::p_load(reshape2, ggplot2, plotly)
  #
  #   ggplot(data = melt(result[,-1]), aes(x=variable, y=log(value))) + geom_boxplot(aes(fill=variable))+theme_bw()
  #
  #
  #
  #   o = ggplotly()

  data_matrix = as.matrix(data)
  if(sum(filter_indicator)>0){
    report_html = paste0("<b>Compounds with zero standard deviations are removed from your dataset. There were ",total_removed," compounds removed from your dataset. The removed compounds are <code>",paste0(f_label_filter_indicator,", "),"</code></b>")
  }else{
    report_html = "<b>There is no compounds with zero standard deviation.</b>"
  }


  result = list(
    result = data_matrix,
    report_html =report_html,
    sds = sds
  )


















