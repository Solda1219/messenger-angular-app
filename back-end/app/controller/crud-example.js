const setting = require('../../config/setting');
const model = require('../model/dept');
const core_func = require('../utils/core_func');
//group
let get = async (req, res) => {
  try {
    const item = await model.getter();
    for(let i = 0 ; i < item.length; i ++){
      const users = await model.getUser(item[i].id);
      item[i].users = users.length;
    }
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let create = async (req, res) => {
  try {
    const data = req.body;
    const exist = await model.exist(data.dept_name);
    if (exist) return res.status(401).json({ message: 'This dept aready exist.' });
    data.created_at = core_func.strftime(Date.now());
    await model.create(data);
    return res.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let edit = async (req, res) => {
  try {
    const data = req.body;
    data.updated_at = core_func.strftime(Date.now())
    const exist = await model.existNotMe(data.id, data.dept_name);
    if (exist) return res.status(401).json({ message: 'This dept already exist.' });
    await model.update(data);
    return res.json({ message: 'Success!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let del = async (req, res) => {
  try {
    await model.del(id);
    return res.json({message: 'Success' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  get,
  create,
  edit,
  del,
}
