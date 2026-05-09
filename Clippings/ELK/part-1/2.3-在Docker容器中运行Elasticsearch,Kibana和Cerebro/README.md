# 在Docker容器中运行Elasticsearch,kibana和Cerebro

##  课程demo

###  在docker中运行Elasticsearch

### 进入7.x-docker-2-es-instance目录

```
#启动
docker-compose up

#停止容器
docker-compose down

#停止容器并移除数据
docker-compose down -v

#一些docker命令
##查看docker容器中正在运行的进程
docker ps

##停止容器中的镜像
docker stop Name/ContainerId

##启动容器中的镜像
docker start Name/ContainerId

#删除单个容器
docker rm Name/ID
-f, –force=false; -l, –link=false Remove the specified link and not the underlying container; -v, –volumes=false Remove the volumes associated to the container

#删除所有容器
dock er rm 'docker ps -a -q'
停止、启动、杀死、重启一个容器
dock er stop Name/ID
docker start Name/ID
docker kill Name/ID
docker restart Name/ID

```



## 相关阅读

- 安装docker https://www.docker.com/products/docker-desktop

- 安装 docker-compose https://docs.docker.com/compose/install/

- 如何创建自己的Docker Image  https://www.elastic.co/cn/blog/how-to-make-a-dockerfile-for-elasticsearch

- 如何在为docker image安装Elasticsearch插件 https://www.elastic.co/cn/blog/elasticsearch-docker-plugin-management

- 如何设置 Docker网络 https://www.elastic.co/cn/blog/docker-networking

- Cerebro源码 https://github.com/lmenezes/cerebro

- 一个开源的ELK(Elasticsearch+Logstash+Kibana) docker-compose配置 https://github.com/deviantony/docker-elk

  Install Elasticsearch with Docker https://www.elastic.co/guide/en/elasticsearch/reference/7.2/docker.html