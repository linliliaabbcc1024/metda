


  pacman::p_load(data.table, ropls)

  # fwrite(data.table(p),"p.csv")
  # fwrite(data.table(f),"f.csv")
  # fwrite(data.table(e),"e.csv")
  # return(p)

  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  if(scale=='none'){
    sds = rep(1,nrow(f))
  }else if(scale=="standard"){
    sds = apply(e,1,sd,na.rm = TRUE)
  }else if(scale=='pareto'){
    sds = sqrt(apply(e,1,sd,na.rm = TRUE))
  }else if(scale == "center"){
    sds = rep(1,nrow(f))
  }

  e_t = t(e)
  e_scale = scale(e_t, center = !scale=='none', scale = sds)

  y = factor(p[[column]])

  plsda_perm = ropls::opls(x = e_scale, y = y, predI = min(10,ncol(e_scale)), perm = n_perm, scaleC ="none", printL = FALSE, plotL = FALSE)

  perm = data.table(sim = plsda_perm@suppLs$permMN[,"sim"], y = c(plsda_perm@suppLs$permMN[,"R2Y(cum)"], plsda_perm@suppLs$permMN[,"Q2(cum)"]), type = rep(c("R2", "Q2"), each = length(plsda_perm@suppLs$permMN[,"R2Y(cum)"])))


  # sim_mean = mean(plsda_perm@suppLs$permMN[,"sim"][-1])
  # R2_mean = mean(plsda_perm@suppLs$permMN[,"R2Y(cum)"][-1])
  # Q2_mean = mean(plsda_perm@suppLs$permMN[,"Q2(cum)"][-1])
  # R2_slope = (plsda_perm@suppLs$permMN[,"R2Y(cum)"][1] - R2_mean)/(1 - sim_mean)
  # Q2_slope = (plsda_perm@suppLs$permMN[,"Q2(cum)"][1] - Q2_mean)/(1 - sim_mean)
  # R2_intercept = plsda_perm@suppLs$permMN[,"R2Y(cum)"][1] - R2_slope*1
  # Q2_intercept = plsda_perm@suppLs$permMN[,"Q2(cum)"][1] - Q2_slope*1




  # g = ggplot(perm, aes(x=sim, y=y, shape=type, color=type)) +
  #   geom_point()+ geom_segment(x = 0, y = R2_intercept, xend=1, yend = R2_intercept + R2_slope, linetype="dashed", color = "black") + geom_segment(x = 0, y = Q2_intercept, xend=1,yend = Q2_intercept + Q2_slope, linetype="dashed", color = "black") + theme_bw()
  # g
  # o = ggplotly()




  # df <- mtcars[, c(1,3,4,5,6,7)]
  # # Correlation matrix
  # cormat <- round(cor(df),2)
  # # Melt the correlation matrix
  # require(reshape2)
  # cormat <- melt(cormat)
  # head(cormat)
  #
  # g <- ggplot(cormat, aes(x = Var1, y = Var2))
  #
  # # 1. Compute correlation
  # cormat <- round(cor(df),2)
  # # 2. Reorder the correlation matrix by
  # # Hierarchical clustering
  # hc <- hclust(as.dist(1-cormat)/2)
  # cormat.ord <- cormat[hc$order, hc$order]
  # # 3. Get the upper triangle
  # cormat.ord[lower.tri(cormat.ord)]<- NA
  # # 4. Melt the correlation matrix
  # require(reshape2)
  # melted_cormat <- melt(data.matrix(iris[1:5,-5]), na.rm = TRUE)
  # # Create the heatmap
  # g = ggplot(melted_cormat, aes(Var2, Var1, fill = value))+
  #   geom_tile(color = "white", size = 5, aes(width=0.7, height=0.7))+
  #   # scale_fill_gradient2(low = "blue", high = "red", mid = "white",
  #   #                      midpoint = 0, limit = c(-1,1), space = "Lab",
  #   #                      name="Pearson\nCorrelation") + # Change gradient color
  #   theme_minimal()+ # minimal theme
  #   theme(axis.text.x = element_text(angle = 45, vjust = 1,
  #                                    size = 12, hjust = 1))+
  #   coord_fixed()
  #
  # o = ggplotly()
  # o




  report_html = paste0("<h4>PLS-DA repoert permutation.</h4>")



  result = list(
    report_html =report_html,
    perm = perm,
    perm_summary =  plsda_perm@summaryDF
  )






















