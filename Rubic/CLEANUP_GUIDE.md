# AeroLink Project Operations Guide (Startup & Clean-Up)

මේ Guide එකේ තියෙන්නේ ඔයාගේ AeroLink Project එක මුල ඉඳන් **Start කරන විදිහයි**, වැඩ ඔක්කොම ඉවර වුණාම සල්ලි කැපෙන්නේ නැති වෙන්න **Destroy කරන විදිහයි** දෙකමයි.

---

## 🟢 PART 1: Project එක Start කිරීම (Startup Guide)
Project එක අලුතින්ම AWS එකේ Deploy කරන්න මේ පියවර අනුගමනය කරන්න.

### Step 1: Cloud Infrastructure එක සෑදීම (Terraform)
මුලින්ම අර AWS Resources (VPC, EKS, DynamoDB, Aurora) ඔක්කොම ටික හදන්න ඕනේ.
```bash
cd "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/terraform"
terraform init
terraform apply -auto-approve
```
*(මේක ඉවර වෙන්න විනාඩි 15ක් 20ක් විතර යයි).*

### Step 2: Kubernetes (EKS) එකට Connect වීම
Terraform ඉවර වුණාට පස්සේ, ඔයාගේ ලැප්ටොප් එකෙන් AWS Kubernetes Cluster එකට කනෙක්ට් වෙන්න මේක දෙන්න.
```bash
aws eks update-kubeconfig --region eu-west-1 --name aerolink-eks-production
```

### Step 3: අලුත් Backend එක Build කරලා AWS ECR එකට යැවීම
අපි අර Database සහ Kafka දාලා අලුතින් හදපු Python Code එක අලුත් Docker Images විදිහට Build කරලා යවන්න ඕනේ.
```bash
cd "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/backend"
chmod +x deploy_backend.sh
./deploy_backend.sh
```

### Step 4: Kafka Cluster එක Kubernetes එකේ Setup කිරීම
අපි Code එකට දාපු Kafka එක වැඩ කරන්න නම් Strimzi Kafka Operator එක EKS එකට දාන්න ඕනේ.
```bash
kubectl create namespace kafka
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl apply -f "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/backend/k8s/kafka-cluster.yaml" -n kafka
```

### Step 5: ArgoCD (GitOps) එක Setup කරලා Microservices Run කිරීම
ඔයාගේ ඔක්කොම Microservices (Booking, Flight, Baggage) ලේසියෙන්ම Deploy කරන්න ArgoCD පාවිච්චි කරන්න.
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/backend/k8s/argocd/application.yaml"
```
*(දැන් ArgoCD එකෙන් ඔටෝම ඔයාගේ Github එක බලාගෙන Microservices ටික EKS එකේ Run කරවයි).*

### Step 6: Frontend Website එක AWS S3 එකට Deploy කිරීම
අන්තිමටම පාරිභෝගිකයින්ට පේන React Website එක Cloud එකට දාන්න මේක දෙන්න.
```bash
cd "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/frontend"
chmod +x deploy.sh
./deploy.sh
```

---

## 🔴 PART 2: Project එක නැවැත්වීම (Clean-Up & Destroy Guide)
ඔයාගේ වැඩ ඔක්කොම ඉවර වුණාම, AWS එකෙන් සල්ලි කැපෙන එක නවත්වන්න මේ පියවර අනුගමනය කරන්න.

### Step 1: Kubernetes Load Balancers මකා දැමීම
Terraform එක හිර වෙන එක වළක්වා ගන්න, මුලින්ම K8s Services ටික අයින් කරන්න ඕනේ:
```bash
kubectl delete svc baggage-service booking-service flight-service -n default
```
*(කමාන්ඩ් එක Run වෙලා "deleted" හෝ "NotFound" කියලා එනකන් තත්පර කීපයක් ඉන්න)*

### Step 2: Terraform හරහා Infrastructure එක Destroy කිරීම
```bash
cd "/Users/macbook/Documents/Documents/Apiit/3years/Cloud Module/Sem2/Cloud-Enterprise/aerolink/terraform"
terraform destroy -auto-approve
```
**⚠️ අනිවාර්යය උපදෙස්:**
* මේ කමාන්ඩ් එකට විනාඩි 10ක් - 15ක් විතර යන්න පුළුවන්. 
* කිසිම හේතුවක් නිසාවත් මේක අතරමඟදී නවත්වන්න එපා.
* අන්තිමට Terminal එකේ රතු පාටින් **"Destroy complete!"** කියලා වැටෙනකන් අනිවාර්යයෙන්ම බලන් ඉන්න. ඒක වැටුණට පස්සේ ඔයාගේ Project එක 100% ක්ම Delete වෙලා ඉවරයි.
