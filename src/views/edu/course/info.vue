<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <!--<el-form label-width="120px">-->
      <!--<el-form-item>-->
        <!--<el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <!--课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'//eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce'//引入组件，声明组件
  export default {
    components: { Tinymce },
      data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo: {
          title: '',
          subjectParentId:'',
          subjectId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
        },
        courseId:'',
        BASE_API:process.env.BASE_API,
        teacherList:[],//封装所有讲师
        subjectOneList:[],//一级分类
        subjectTwoList:[]//二级分类
  }
  },
  created() {
    //获取到路由里面的id值
    if (this.$route.params && this.$route.params.id){
      this.courseId= this.$route.params.id;
      this.getInfo()
    }else{
      this.getListTeacher()//初始化所有讲师
      this.getOneSubject()//初始化所有一级分类
      //this.courseInfo=[]
      this.courseInfo={
          title: '',
          subjectParentId:'',
          subjectId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
      }
    }
  },

  methods: {
    //根据课程id查询
    getInfo(){
      course.getCourseInfo(this.courseId)
        .then(response=>{
          this.courseInfo=response.data.courseInfoVo;
          //查询出所有分类，包含一级和二级
          subject.getSubjectList()
            .then(response=>{
              //先获取所有的一级分类
              this.subjectOneList=response.data.list;
              //把所有的一级分类数组进行遍历
              for(var i=0;i<this.subjectOneList.length;i++){
                var oneSubject=this.subjectOneList[i];
                if (this.courseInfo.subjectParentId==oneSubject.id){
                  this.subjectTwoList=oneSubject.children;
                }

              }
            })
          this.getListTeacher()//初始化所有讲师
        })
    },
    //上传封面成功调用的方法
    handleAvatarSuccess(res, file){
      console.log(res)// 上传响应
      this.courseInfo.cover=res.data.url;
    },
    //上传之前调用的方法
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //当我们点击一级分类，会触发二级分类
    subjectLevelOneChanged(value){
      //value就是一级分类的id值
      //遍历所有的分类，里面包含一级和二级
      for(var i=0;i<this.subjectOneList.length;i++){
        //每一个一级分类和刚才点击的一级分类是否一样
        var oneSubject=this.subjectOneList[i]
        if(value==oneSubject.id){
          //从一级分类中取到二级分类
          this.subjectTwoList=oneSubject.children
          this.courseInfo.subjectId=''
        }

      }

    },
    //查询所有的一级分类
    getOneSubject(){
      subject.getSubjectList(this.courseId)
        .then(response=>{
          this.subjectOneList=response.data.list
        })
    },
    //查询所有的讲师
    getListTeacher(){
      course.getListTeacher()
        .then(response=>{
          this.teacherList=response.data.items
        })
    },
    addCourse(){
      course.addCourseInfo(this.courseInfo)
        .then(response=>{
          this.$message({
            type: 'success',
            message: '添加课程信息成功!'
          });
          this.$router.push({ path: '/course/chapter/'+response.data.courseId})
        });
    },
    updateCourse(){
      course.updateCourseInfo(this.courseInfo)
        .then(response=>{
          this.$message({
            type: 'success',
            message: '修改课程信息成功!'
          });
          this.$router.push({ path: '/course/chapter/'+this.courseId})
        })
    },
    saveOrUpdate() {
      //判断添加还是修改
      if (!this.courseInfo.id){
        this.addCourse();
      } else {
        this.updateCourse();
      }

    }
  }
  }
</script>
