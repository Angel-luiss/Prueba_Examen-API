module.exports = (sequelize, Sequelize) => {
    const Horario = sequelize.define('horario', {
        id_horario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_catedratico: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        curso: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        hora_inicio: {
            type: Sequelize.DATE,
            allowNull: false
        },
        hora_fin: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    return Horario;
}
