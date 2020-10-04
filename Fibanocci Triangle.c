#include <stdio.h>
int main(){
    int first=0,second=1,n;
    printf("Enter the limit: ");
    scanf("%d",&n);
    for(int i=1;i<=n;i++){
        first=0;
        second=1;
        printf("%d\t",second);
        for(int j=1;j<i;j++){
            int next=first+second;
            printf("%d\t",next);
            first=second;
            second=next;
        }
        printf("\n");
    }
    return 0;
}