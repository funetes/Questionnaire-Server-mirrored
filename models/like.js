module.exports = function(sequelize, DataTypes){
    return sequelize.define("like", {
        like: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        audience_id:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
}