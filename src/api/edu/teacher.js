import request from '@/utils/request'

export default {
  //1.讲师列表（条件查询分页）
  //2.current当前页 limit每页记录数 teacherQuery条件对象
  getTeacherListPage(current,limit,teacherQuery){
    return request({
      //url: '/table/list/'+current+"/"+limit,
      url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      //teacherQuery条件对象，后端使用requestBody获取数据
      //data表示把对象转换成json进行传递到接口中
      data:teacherQuery
    })
  },
  deleteTeacherId(id){
    return request({
      url:`/eduservice/teacher/${id}`,
      method: 'delete'
    })
  },
  addTeacher(teacher){
    return request({
      url:`/eduservice/teacher/addTeacher`,
      method: 'post',
      data:teacher
    })
  },
  getTeacherInfo(id){
    return request({
      url:`/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  //修改讲师
  updateTeacherInfo(teacher){
    return request({
      url:`/eduservice/teacher/updateTeacher`,
      method: 'post',
      data:teacher
    })
  }

}

