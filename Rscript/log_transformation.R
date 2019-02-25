
  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  # pNAs = 0.1
  # upper.q = 0.99
  # qnorm(seq((pNAs+0.001),(upper.q+0.001),(upper.q-pNAs)/(upper.q*100)),
  #       mean = 0, sd = 1)

  # pacman::p_load(ggplot2, plotly)
  # set.seed(1234)
  # dat <- data.frame(cond = factor(rep(c("A","B"), each=200)),
  #                   rating = c(rnorm(200),rnorm(200, mean=.8)))
  # # View first few rows
  # head(dat)
  # # Find the mean of each group
  # library(plyr)
  # cdat <- ddply(dat, "cond", summarise, rating.mean=mean(rating))
  # cdat
  # #>   cond rating.mean
  # #> 1    A -0.05775928
  # #> 2    B  0.87324927
  #
  # # Overlaid histograms with means
  # g = ggplot(dat, aes(x=rating, fill=cond)) +
  #   geom_histogram(binwidth=.5, alpha=.5, position="identity") +
  #   geom_vline(data=cdat, aes(xintercept=rating.mean,  colour=cond),
  #              linetype="dashed", size=1)
  #
  # oo = ggplotly(g)

  # r = rlnorm(1000)
  # o = hist(r, breaks = 100)
  # o2 = hist(log10(r), breaks = 100)
  #
  #
  # e = t(apply(e,1,function(x){
  #   x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
  #   return(x)
  # }))
  #
  if(method == "log10"){
    result = log((e + sqrt(e^2 + 4)) * 0.5, base  = 10)
  }else if(method == "log2"){
    result = log((e + sqrt(e^2 + 4)) * 0.5, base  = 2)
  }


  p_plus_e = rbind(cbind(colnames(p),t(p)), cbind(f$label,result))

  # add some NA to the top of the f.
  f_label_index = which(p_plus_e[,1]=='label')
  NA_plus_f = rbind(matrix(NA, nrow = f_label_index-1, ncol = ncol(f)),rbind(matrix(colnames(f), nrow = 1),sapply(f, as.character)))
  NA_plus_f = NA_plus_f[,-which(colnames(NA_plus_f) %in% 'label')]

  data = cbind(NA_plus_f, p_plus_e)


  #   pacman::p_load(reshape2, ggplot2, plotly)
  #
  #   ggplot(data = melt(result[,-1]), aes(x=variable, y=log(value))) + geom_boxplot(aes(fill=variable))+theme_bw()
  #
  #
  #
  #   o = ggplotly()

  data_matrix = as.matrix(data)
  report_html = paste0("<b>The generalized <code>",method,"</code> transformation was performed on the original dataset.</b>")

 result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )























