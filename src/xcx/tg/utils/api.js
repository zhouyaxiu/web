var BaseUrl = "https://www.fanhantech.com";
var Projects = "/api/projects";
var Project = "/api/project";
var Login = "/api/login";
var Register = "/api/register";
var Password = "/api/password";
var CheckMobile = "/api/account/mobile";
var Smsverificationcode = "/api/account/smsverificationcode";
var Logout = "/logout";
var ProjectId = "/api/project/[project_id]";
var getTask = "/task";
var Nameauth = "/api/user/real";
var UserInfo = "/api/user/profile";
var Skill = "/api/user/skill";

function _BaseUrl() {
  return BaseUrl;
}

function _getProjects() {
  return BaseUrl + Projects;
}

function _getProject(id) {
  return BaseUrl + Project;
}

function _getLogin() {
  return BaseUrl + Login;
}

function _getResgister() {
  return BaseUrl + Register;
}

function _getPassword() {
  return BaseUrl + Password;
}
function _getCheckMobile() {
  return BaseUrl + CheckMobile;
}

function _getSmsverificationcode() {
  return BaseUrl + Smsverificationcode;
}

function _getLogout() {
  return BaseUrl + Logout;
}

function _getProjectId() {
  return BaseUrl + ProjectId;
}

function _getTask() {
  return getTask;
}

function _Nameauth() {
  return BaseUrl + Nameauth;
}

function _UserInfo() {
  return BaseUrl + UserInfo;
}

function _Skill() {
  return BaseUrl + Skill;
}
module.exports = {
  getProjects: _getProjects,
  getProject: _getProject,
  getLogin: _getLogin,
  getResgister: _getResgister,
  getPassword: _getPassword,
  getLogout: _getLogout,
  getProjectId: _getProjectId,
  getTask: _getTask,
  getCheckMobile: _getCheckMobile,
  getSmsverificationcode: _getSmsverificationcode,
  Nameauth: _Nameauth,
  UserInfo: _UserInfo,
  Skill: _Skill
};