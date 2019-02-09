testing = function(){






  pacman::p_load(lme4, ez)

  #response data from 10 subjects under two conditions
  x1<-rnorm(10)
  x2<-1+rnorm(10)

  # Now create a dataframe for lme
  myDat <- data.frame(c(x1,x2), c(rep("x1", 10), rep("x2", 10)), rep(paste("S", seq(1,10), sep=""), 2))
  names(myDat) <- c("y", "x", "subj")


  # paired t test

  t.test(x1, x2, paired = TRUE) # 1


  summary(aov(y ~ x + Error(subj/x), myDat)) # 2


  summary(fm1 <- lme(y ~ x, random=list(subj=pdSymm(form=~x-1)), data=myDat)) # 5


  summary(fm2 <- lme(y ~ x, random=list(subj=pdCompSymm(form=~x-1)), data=myDat)) # 4

  summary(lme(y ~ x, random=~1|subj, data=myDat)) # 3


  # two-way repeated anova

  myDat = rbind(myDat, myDat)

  myDat$y = rnorm(length(myDat$y))

  myDat$x2 = rep(c("a","b"), each = nrow(myDat)/2)


  summary(aov(y ~ x*x2 + Error(subj/x*x2), myDat))[["Error: subj:x:x2"]][[1]][["Pr(>F)"]][1]


  summary(fm1 <- lme(y ~ x*x2, random=list(subj=pdSymm(form=~x*x2-1)), data=myDat))


  summary(fm2 <- lme(y ~ x*x2, random=list(subj=pdCompSymm(form=~x*x2-1)), data=myDat))

  summary(lme(y ~ x*x2, random=~1|subj, data=myDat))

  # two-way effect model
  two_way_data = data.table(y = rnorm(10), x1 = rep(LETTERS[1:2],each = 5), x2 = c("C","D"),id = 1:10)

  summary(aov(y ~ x1*x2, two_way_data))[[1]][3,'Pr(>F)']


  # two_way_mixed effect model
  two_way_mixed_data = data.table(y = rnorm(12), x1 = rep(LETTERS[1:2],each = 6), x2 = c("C","D"),id = rep(1:6, each = 2))

  summary(aov(y ~ x1*x2 + Error(id/x2), two_way_mixed_data))


  #[[3]][[1]][3,'Pr(>F)']

  ezANOVA(
    data = two_way_mixed_data
    , dv = .(y)
    , wid = .(id)
    , between = .(x1),
    , within = .(x2)
  )






  pacman::p_load(iheatmapr)



  data(measles, package = "iheatmapr")

  o = main_heatmap(measles, name = "Measles<br>Cases", x_categorical = FALSE,
               layout = list(font = list(size = 8))) %>%
    add_col_groups(ifelse(1930:2001 < 1961,"No","Yes"),
                   side = "bottom", name = "Vaccine<br>Introduced?",
                   title = "Vaccine?",
                   colors = c("lightgray","blue")) %>%
    add_col_labels(ticktext = seq(1930,2000,10),font = list(size = 8)) %>%
    add_row_labels(size = 0.3,font = list(size = 6)) %>%
    add_col_summary(layout = list(title = "Average<br>across<br>states"),
                    yname = "summary")  %>%
    add_col_title("Measles Cases from 1930 to 2001", side= "top") %>%
    add_row_summary(groups = TRUE,
                    type = "bar",
                    layout = list(title = "Average<br>per<br>year",
                                  font = list(size = 8)))



  pacman::p_load(ggdendro, plotly)


  library(ggplot2);library(plotly)
  hc <- hclust(dist(USArrests), "ave")
  p <- ggdendrogram(hc, rotate=FALSE)
  o = ggplotly(p)



  hc <- hclust(dist(USArrests), "ave")
  ggdendrogram(hc, rotate = FALSE, size = 2)
  ggplotly()




  layout = plotly:::ggfun("create_layout")(p$facet, p$coordinates)


  layout$setup_panel_params()

  layout$panel_params











  n = 100
  set.seed(1)
  x = rnorm(100)
  set.seed(2)
  z = x * 2 * rnorm(100)
  set.seed(3)
  y = x * 3 + z * 2 + rnorm(100)

  # resutl of original linear regression
  lm_ori = lm(y ~ x+z)
  sm_ori = summary(lm_ori)
  # Coefficients:
  #              Estimate Std. Error t value Pr(>|t|)
  # (Intercept)  0.02538    0.08692   0.292    0.771
  # x            3.01264    0.10001  30.124   <2e-16 ***
  # z            2.04855    0.03871  52.914   <2e-16 ***
  #   ---
  #   Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
  #
  # Residual standard error: 0.8577 on 97 degrees of freedom
  # Multiple R-squared:  0.9692,	Adjusted R-squared:  0.9686
  # F-statistic:  1526 on 2 and 97 DF,  p-value: < 2.2e-16

  # result indirect
  r_x = lm_ori$residuals + lm_ori$coefficients["x"] * x
  lm_ind = lm(r_x ~ x)
  sm_ind = summary(lm_ind)
  # Coefficients:
  #              Estimate Std. Error t value Pr(>|t|)
  # (Intercept)  0.00000    0.08596    0.00        1
  # x            3.01264    0.09548   31.55   <2e-16 ***
  #   ---
  #   Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
  lm_ind$coefficients["x"]/sm_ind$coefficients[,"Std. Error"]["x"] # 31.55265
  lm_ori$coefficients["x"]/sm_ori$coefficients[,"Std. Error"]["x"]

  sqrt((mean(lm_ori$residuals^2)*(n/(n-3)))/(var(x)*(length(x)-1)))


  s_ori = sqrt(mean(lm_ori$residuals^2)*(n/(n-3)))
  s_ori * sqrt(
    n/(n*sum(x^2) - (sum(x))^2)
  )










# one_way_boxplot
  pacman::p_load(ggplot2, plotly)
  ToothGrowth$dose <- as.factor(ToothGrowth$dose)
  # Basic box plot
  ggplot(ToothGrowth, aes(x=dose, y=len)) +
    geom_boxplot(fill="gray")+
    labs(title="Plot of length per dose",x="Dose (mg)", y = "Length")+
    theme_classic()
  # Change  automatically color by groups
  bp <- ggplot(ToothGrowth, aes(x=dose, y=len, fill=dose)) +
    geom_boxplot()+
    labs(title="Plot of length  per dose",x="Dose (mg)", y = "Length")
  bp + theme_classic()


  # Continuous colors
  bp + scale_fill_brewer(palette="Blues") + theme_classic()
  # Discrete colors
  bp + scale_fill_brewer(palette="Dark2") + theme_minimal()
  # Gradient colors
  bp + scale_fill_brewer(palette="RdBu") + theme_minimal()

  oo = ggplotly()

  oo$x$data[[1]]
  oo$x$layout





  pacman::p_load(MASS)

  o = boxcox(Volume ~ log(Height) + log(Girth), data = trees,
         lambda = seq(-0.25, 0.25, length = 10))





  svgbase642zip = function(base64s = c("iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="),filenames = c("test.png"), zip_filename = 'result.zip'){


    pacman::p_load(base64enc,rsvg)



    library(base64enc)
    enc <- base64encode("tiger.png")
    print(Sys.time())

    for(i in 1:1000){
      print(i)

      conn <- file("w.bin","wb")
      writeBin(enc, conn)
      close(conn)

      inconn <- file("w.bin","rb")
      outconn <- file(paste0("img",i,".png"),"wb")
      base64decode(what=inconn, output=outconn)
      close(inconn)
      close(outconn)

    }
    Sys.time()
    zip(zipfile = zip_filename, files = "img2.png")











    return(TRUE)

  }



  # o  = readtext("test.rtf")
  # oo  = strsplit(o$text,"kerning0\n")[[1]][2]
  # oo= substr(oo,1,nchar(oo)-1)
  #
  #
  # conn <- file("w.bin","wb")
  # writeBin(oo, conn)
  # close(conn)
  # inconn <- file("w.bin","rb")
  # outconn <- file("temp.svg","wb")
  # base64decode(what=inconn, output=outconn)
  # close(inconn)
  #
  # close(outconn)


  set.seed(123)
  N      <- 10
  P      <- 4
  muJ    <- rep(c(-1, 0, 1, 2), each=N)
  dfRBpL <- data.frame(id=factor(rep(1:N, times=P)),
                       IV=factor(rep(1:P,  each=N)),
                       DV=rnorm(N*P, muJ, 3))



  dfRBpW <- reshape(dfRBpL, v.names="DV", timevar="IV", idvar="id",
                    direction="wide")


  library(car)
  fitRBp   <- lm(cbind(DV.1, DV.2, DV.3, DV.4) ~ 1, data=dfRBpW)
  inRBp    <- data.frame(IV=gl(P, 1))
  AnovaRBp <- Anova(fitRBp, idata=inRBp, idesign=~IV)
  summary(AnovaRBp, multivariate=FALSE, univariate=TRUE)













}
