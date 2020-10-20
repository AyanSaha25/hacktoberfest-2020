import java.util.*;
class vec1{
    public static void main(String args[]){
        Vector v = new Vector();
        for(int i=0;i<args.length;i++){
            v.add(args[i]);
        }
        int size=v.size();
        String str[]= new String[size];
        v.copyInto(str);
        for(int i=0;i<size;i++) {
            System.out.println ("Element of Vector at position "+i+" : "+str[i]);
        }
    }
}