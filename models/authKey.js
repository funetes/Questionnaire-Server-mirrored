module.exports = function(sequelize, DataTypes){
    return sequelize.define("authKey", {
        authKey: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        timestamps: true
    });
}