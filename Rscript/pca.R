

  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
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

  pca = prcomp(e_scale, center = FALSE)
  variance = round(pca$sdev^2/sum(pca$sdev^2),4)

  # data.table(x, rep(pca$x[,1],5))


  scores = pca$x
  loadings = pca$rotation

  report_html = paste0("<h4></h4>")














  # pca = prcomp(e_scale, center = FALSE)
  # variance = pca$sdev^2/sum(pca$sdev^2)
  #
  # # pair sample plot
  # plot_data = data.table(x = c(rep(pca$x[,1],5),rep(pca$x[,2],5),rep(pca$x[,3],5),rep(pca$x[,4],5),rep(pca$x[,5],5)),
  #                        y = c(rep(c(pca$x[,1],pca$x[,2],pca$x[,3],pca$x[,4],pca$x[,5]),5)),
  #                        species = p$species,
  #                        treatment = p$treatment,
  #                        pcy = c(rep("pc1",nrow(pca$x)),rep("pc2",nrow(pca$x)),rep("pc3",nrow(pca$x)),rep("pc4",nrow(pca$x)),rep("pc5",nrow(pca$x))),
  #                        pcx = c(rep("pc1",nrow(pca$x)*5),rep("pc2",nrow(pca$x)*5),rep("pc3",nrow(pca$x)*5),rep("pc4",nrow(pca$x)*5),rep("pc5",nrow(pca$x)*5)))
  #
  # ggplot(plot_data, aes(x=x, y=y, color = species, shape = treatment )) + geom_point() + facet_grid(pcx ~ pcy, scales = "free")+theme_bw() +  theme(strip.background = element_blank()) + labs(x = "", y = "")
  # o = ggplotly()
  #
  # # score plot
  # library("FactoMineR")
  # library("factoextra")
  # iris.pca <- PCA(iris[,-5], graph = FALSE)
  # fviz_pca_ind(iris.pca,
  #              pointshape = 21, col.ind = "black",fill.ind = iris$Species ,palette = c("#00AFBB", "#E7B800", "#FC4E07"),addEllipses = TRUE, geom.ind = "point"
  # )
  # o = ggplotly()


  result = list(
    scores = scores,
    loadings = loadings,
    variance = variance,
    report_html =report_html
  )

















