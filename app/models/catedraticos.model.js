module.exports = (sequelize, Sequelize) => {
    const Catedratico = sequelize.define('catedratico', {
        IdCatedratico: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        NombreCompleto: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        FechaContratacion: {
            type: Sequelize.DATE,
            allowNull: false
        },
        FechaNacimiento: {
            type: Sequelize.DATE,
            allowNull: false
        },
        Genero: {
            type: Sequelize.STRING(10)
        },
        Titulo: {
            type: Sequelize.STRING(100)
        },
        Salario: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        }
    });

    return Catedratico;
}
