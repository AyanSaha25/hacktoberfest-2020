#include<stdio.h>
#include<conio.h>

int main()
{
    int n, p, q, r, i, j, y=0, a[100][100];
    printf("Enter a number:");
    scanf("%d", &n);

    p=n+n-1;
    r=p-1;
    q=(p-1)/2;
    for(i=0; i<q; i++)
    {
        for(j=0; j<p; j++)
        {
            if(a[i][j+y]==0 || a[r][j+y]==0 || a[j+y][r]==0 || a[j+y][i]==0)
                a[i][j+y]=a[r][j+y]=a[j+y][r]=a[j+y][i]=n;
        }
        y++;
        n--;
        r--;
    }

    a[q][q]=1;
    printf("\n");
    for(i=0; i<p; i++)
    {
        for(j=0; j<p; j++)
        {
            printf("%d ",a[i][j]);
        }
        printf("\n");
    }
    return 0;
}