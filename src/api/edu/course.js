import request from '@/utils/request'

export default {
  //1.添加课程信息
  addCourseInfo(courseInfo){
    return request({
      //url: '/table/list/'+current+"/"+limit,
      url:`/eduservice/educourse/addCourseInfo`,
      method: 'post',
      data:courseInfo
    })
  },
  //查询所有讲师
  getListTeacher(){
    return request({
      url:`/eduservice/teacher/findAll`,
      method: 'get'
    })
  },
  //根据课程id查询课程基本信息
  getCourseInfo(courseId){
    return request({
      url:`/eduservice/educourse/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  //修改课程的基本信息
  updateCourseInfo(courseInfo){
    return request({
      url:`/eduservice/educourse/updateCourseInfo`,
      method: 'post',
      data:courseInfo
    })
  },
  //课程信息确认
  getPublishCourseInfo(id){
    return request({
      url:`/eduservice/educourse/getPublishCourseInfo/${id}`,
      method: 'get'
    })
  },
  //课程最终发布
  publishCourse(id){
    return request({
      url:`/eduservice/educourse/publishCourse/${id}`,
      method: 'post'
    })
  },
  //查询所有课程
  getListCourse(){
    return request({
      url:`/eduservice/educourse/getCourseList`,
      method: 'get'
    })
  }

}

