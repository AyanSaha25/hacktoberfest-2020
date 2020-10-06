
package mangement;

import java.sql.Connection;
import java.sql.DriverManager;
import javax.swing.JOptionPane;


public class MySqlConnect {
     Connection conn= null;
     public static Connection ConnectDB()
  
    {
    
        try
        {
            Class.forName("com.mysql.jdbc.Driver");
           Connection conn=DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/blood_management_system","root","");
            return conn;
        }
        catch(Exception e )
        {
            JOptionPane.showMessageDialog(null, e);
            return null;
        }
    
    
    }
}
    
