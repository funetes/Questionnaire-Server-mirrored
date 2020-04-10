module.exports = function(sequelize, DataTypes){
    return sequelize.define("question", {
        questioner: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content:{
            type: DataTypes.STRING,
            allowNull: false
        },
        numberOfLikes:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        answered:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: false
        },
    },{
        timestamps: true
    });
};

