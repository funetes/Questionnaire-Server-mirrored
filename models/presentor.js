module.exports = function(sequelize, DataTypes){
    return sequelize.define("presentor", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}