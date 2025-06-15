module.exports = (
  sequelize: {
    define: (
      arg0: string,
      arg1: {
        id: { type: number; primaryKey: boolean; autoIncrement: boolean };
        title: { type: string; allowNull: boolean };
        description: { type: string };
        assigned_to: { type: any; references: { model: string; key: string } };
        status: {
          type: any;
          allowNull: boolean;
          defaultValue: string;
          values: string[];
        };
        start_date: { type: Date };
        end_date: { type: Date };
      }
    ) => any;
  },
  Sequelize: {
    INTEGER: number;
    STRING: string;
    TEXT: string;
    ENUM: any;
    DATE: Date;
  }
) => {
  const Task = sequelize.define("tasks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    assigned_to: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      defaultValue: "pending",
      values: ["pending", "active", "completed", "deferred", "rejected"],
    },
    start_date: {
      type: Sequelize.DATE,
    },
    end_date: {
      type: Sequelize.DATE,
    },
  });

  Task.associate = (models: any) => {
    Task.belongsTo(models.User, {
      foreignKey: "assigned_to",
      as: "assignee",
    });
  };

  return Task;
};
