<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  //引入teacher.js
  import teacherApi from '@/api/edu/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  export default {
    components: { ImageCropper, PanThumb },
    data() {
      return {
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: 'https://zjut-jtj.oss-cn-beijing.aliyuncs.com/1.jpeg'
        },
        //上传弹框组件是否显示
        imagecropperShow:false,
        imagecropperKey:0,
        //获取dev.env.js里面的端口号
        BASE_API:process.env.BASE_API,
        saveBtnDisabled: false // 保存按钮是否禁用,
      }
    },
    created(){
     this.init();
    },
    watch:{//路由变化的方式
      $route(to,from){//路由发生变化
        this.init();
      }
    },
    methods:{
      close(){
        this.imagecropperShow=false;
        //上传组件初始化
        this.imagecropperKey=this.imagecropperKey+1;
      },
      cropSuccess(data){
        //上传成功返回图片地址
        this.teacher.avatar=data.url;
        this.imagecropperShow=false;
        this.imagecropperKey=this.imagecropperKey+1;
      },
      init(){
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          console.log("1"+id);
          this.getInfo(id)
        }else {//清空表单
          this.teacher={}
        }
      },
      getInfo(id){
        teacherApi.getTeacherInfo(id)
          .then(response=>{
            this.teacher=response.data.teacher
            console.log(response.data.teacher)
          })
      },
      saveOrUpdate(){
        //根据teacher里面是否有id
        if(!this.teacher.id){
          //修改
          this.saveTeacher()
        }else{
          //添加
          this.updateTeacher()
        }
      },
      saveTeacher(){
        teacherApi.addTeacher(this.teacher)
          .then(response=>{//添加成功
            //提示信息
            this.$message({
              type: 'success',
              message: '添加成功!'
            });

            //回到列表页面，路由跳转
            this.$router.push({ path: '/teacher/table' })
          })
          .catch(error=>{
            //提示信息
            this.$message({
              type: 'success',
              message: '添加失败!'
            });
          })
      },
      updateTeacher(){
        teacherApi.updateTeacherInfo(this.teacher)
          .then(response=>{
            //提示信息
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            //回到列表页面，路由跳转
            this.$router.push({ path: '/teacher/table' })
          })
      }

    }
  }
</script>
