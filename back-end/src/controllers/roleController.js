const mongoose = require("mongoose");
const RoleModel = require("../models/role");
const UserModel=require("../models/User");
const PermissionModel = require("../models/permissions");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find().populate("permissionIds");
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRole=async(req,res)=>{
  try{
    const{name,permissionIds}=req.body;

    const existingRole=await RoleModel.findOne({name});
    if(existingRole)
      return res.status(400).json({message:"Role already exists"});

     if (!permissionIds || permissionIds.length === 0) {
      return res.status(400).json({
        message: "At least one permission is required"
      });
    }

    const permissions = await PermissionModel.find({
      _id: { $in: permissionIds }
    });

    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({message: "Permission IDs are invalid"});
    }

    const roles= await RoleModel.create({
      name,
      permissionIds
    });
    res.status(200).json({message:"Role Created Successfully",roles});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
};


exports.updateRole=async(req,res)=>{
  try{
    const{roleId}=req.params;
    const{name,permissionIds}=req.body;
    
    const role=await RoleModel.findById(roleId);
    if(!role){
      return res.status(404).json({message:"Role not found"});
    }
    if(name){
      role.name=name.toLowerCase();
    }

    if(permissionIds){
      role.permissionIds=permissionIds;
    }
    
    const permissions = await PermissionModel.find({
      _id: { $in: permissionIds }
    });

    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({message: "Permission IDs are invalid"});
    }

    await role.save();

    res.status(200).json({message:"Role Updated Successfully",role});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const role = await RoleModel.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Remove role from all users
    await UserModel.updateMany(
      { role: roleId },
      { $pull: { role: roleId } }
    );

    // Delete role
    await RoleModel.findByIdAndDelete(roleId);

    res.status(200).json({
      message: "Role deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { roleId, permissionIds } = req.body;

    const role = await RoleModel.findByIdAndUpdate(
      roleId,
      { permissionIds },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Role permissions updated successfully",
      role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRolePermissions = async(req,res)=>{
  try{
    const {roleId,permissionIds}=req.body;
    const role = await RoleModel.findByIdAndUpdate(
      roleId,
      {
        $pull: {
          permissionIds: { $in: permissionIds }
        }
      },
      { new: true }
    );

    if(!role)
    {
      return res.status(400).json({message:"Role not found"});
    }
    res.status(200).json({message:"Role permissions deleted successfully",role});
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.updateUserRole=async(req,res)=>{
  try{
    const{userId,roleId}=req.body;

    const role=await RoleModel.findById(roleId);
    if(!role){
      return res.status(404).json({message:"Role not found"});
    }

    const user=await UserModel.findByIdAndUpdate(userId);
    if(!user)
    {
      return res.status(400).json({message:"User not found"});
    }

    user.roles = [roleId];

    await user.save();

    res.status(200).json({message:"User role updated successfully",user});
    
  }catch(err){
      res.status(500).json({message:err.message});
  }
};

