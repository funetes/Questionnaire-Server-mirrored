module.exports = function(sequelize, DataTypes){
    return sequelize.define("event", {
        eventname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code_name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique : true,
        },
        closedAt:{
            type:DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    },{
        timestamps: true
    });
}