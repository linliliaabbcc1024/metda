

  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))

  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  known_compound_index = f[[column]] == level

  mtic = apply(e[known_compound_index,],2,sum)
  result = t(t(e) * (mean(mtic)/mtic))

  result = data.table(index = 1:nrow(f),label = f$label,result)
  colnames(result) = c("index","label", p$label)



#   pacman::p_load(reshape2, ggplot2, plotly)
#
#   ggplot(data = melt(result[,-1]), aes(x=variable, y=log(value))) + geom_boxplot(aes(fill=variable))+theme_bw()
#
#
#
#   o = ggplotly()



  report_html = paste0("<h4>mTIC normalization is performed.</h4>")

  result = list(
    result = result,
    report_html =report_html
  )




















